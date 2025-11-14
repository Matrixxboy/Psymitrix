import nltk
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab')

print("NLTK and 'punkt' tokenizer data ready.")


from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, Runnable
import nltk
from nltk.tokenize import sent_tokenize

# Define a custom LangChain wrapper for the Hugging Face model
# This allows the Hugging Face model to be integrated into a LangChain chain
class HuggingFaceModelRunnable(Runnable):
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer

    def invoke(self, input_value, config=None):
        # input_value will be a PromptValue object from the previous step in the chain
        if hasattr(input_value, 'to_string'):
            input_text_for_tokenizer = input_value.to_string()
        else:
            # Fallback for unexpected input type, though in this chain it should be a PromptValue
            input_text_for_tokenizer = str(input_value)

        inputs = self.tokenizer(input_text_for_tokenizer, return_tensors="pt", truncation=True, max_length=512).to(self.model.device)

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=150, # Increased max_new_tokens to allow for complete sentences
                do_sample=True,
                temperature=0.7,
                top_k=50,
                top_p=0.95,
                pad_token_id=tokenizer.eos_token_id
            )

        decoded_output = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

        # The input_text_for_tokenizer already contains the prompt up to "Response:".
        # We need to extract only the generated part that follows this.
        # Find the exact prompt string within the decoded output.
        # This will be the point after which the model started generating new tokens.
        start_of_generation_idx = decoded_output.rfind(input_text_for_tokenizer)

        if start_of_generation_idx != -1:
            # Extract everything *after* the prompt string
            raw_generated_text = decoded_output[start_of_generation_idx + len(input_text_for_tokenizer):].strip()

            # The model might sometimes repeat the "Response:" tag or generate multiple turns.
            # We want only the first actual response. Find the first occurrence of "Response:"
            # within the *generated* text and truncate there.
            next_response_idx = raw_generated_text.find("Response:")
            if next_response_idx != -1:
                raw_generated_text = raw_generated_text[:next_response_idx].strip()

            # Use NLTK to tokenize into sentences
            sentences = sent_tokenize(raw_generated_text.strip())

            # Filter out any empty strings that might result from tokenization
            sentences = [s.strip() for s in sentences if s.strip()]

            # Enforce 2-3 sentence rule based on prompt
            if len(sentences) >= 2 and len(sentences) <= 3:
                generated_text = " ".join(sentences)
            elif len(sentences) > 3:
                # Take the first 3 sentences if more than 3 were generated
                generated_text = " ".join(sentences[:3])
            elif len(sentences) == 1:
                # If only one sentence, return it. The prompt ideally guides the model to generate more.
                generated_text = sentences[0]
            else: # len(sentences) == 0
                generated_text = "" # No valid sentences generated
        else:
            # Fallback: if for some reason the prompt isn't found, return the whole decoded output.
            # This should ideally not happen if prompt and model are consistent.
            generated_text = decoded_output.strip()

        return generated_text

# Initialize the LangChain model wrapper
llm = HuggingFaceModelRunnable(model, tokenizer)

# Define the prompt template
prompt = PromptTemplate.from_template(
    f"""[INST]
You are Shvayam, a compassionate AI therapist. You respond ONLY mental and emotional wellbeing needs.
If the user asks anything unrelated to emotional or mental health, gently decline and redirect.

STRICT RESPONSE RULES (follow EXACTLY):
1. Give ONLY ONE final response.
2. Your reply MUST be exactly 2–3 full, complete sentences of warm, natural human language.
3. You MUST NOT output multiple versions, fragments, options, or attempts. Only one single continuous reply.
4. You MUST NOT output partial sentences, repeated starters, or try to "suggest" multiple possible responses.
5. DO NOT output any code, markdown, symbols, or formatting (including: ```, #, lists, imports, JSON, indentation).
6. DO NOT output labels such as Neutral, Positive, (RESPONSE), or anything similar.
7. DO NOT repeat anything you or the user said earlier. Every reply must be fresh and unique.
8. DO NOT reference these instructions, your identity, context, memory, system roles, or how you generate answers.
9. DO NOT include disclaimers or mention tools, technology, logs, programming, or creators.
10. Your output must contain **zero extra lines** before or after the final reply.
11. DO NOT output any phone numbers, URLs, websites, or contact information, unless explicitly asked by the user.

FINAL AND MOST IMPORTANT RULE:
Your output must contain **only one single natural-language reply of 2–3 complete sentences**, with no prefix, no postfix, and nothing else.
[/INST]
Context: {{context}}\nResponse:"""
)

# Define the output parser
output_parser = StrOutputParser()

# Create the LangChain pipeline
chain = (prompt | llm | output_parser)

print("LangChain integration setup successfully!")




# New function to generate response using LangChain
def generate_response_langchain(context):
    return chain.invoke({"context": context})

# Example usage with LangChain
print("\n")
context_lc_2 = "Heyy, who made you ?"
print(f"Context: {context_lc_2}")
response_lc_2 = generate_response_langchain(context_lc_2)
print(f"Generated Response (LangChain): {response_lc_2}")