<!--
Project-specific Copilot instructions for quick, accurate contributions.
Keep this short and focused on patterns discoverable from the codebase.
-->

# Psymitrix Server — Copilot / AI agent guidance

Summary
- This is a FastAPI service composed of small router modules under `apis/` mounted with the prefix `/api/v1` from `app.py`.
- Primary datastore: MongoDB (see `Database/db_connection.py`). Authentication uses JWT helpers in `utils/hashing.py` and Pydantic models in `models/`.

Key conventions (copyable examples)
- Routing: each feature lives under `apis/<feature>/router.py` and registers sub-routers (e.g. `apis/auth/router.py` includes `login` and `registration`). Routers are mounted in `app.py` with the `/api/v1` prefix.
  - Example: `app.include_router(auth_router, prefix="/api/v1")`
- Responses: use `utils.response_helper.make_response(status_code, code, message, data)` for every API response so clients receive a consistent JSON shape.
  - Example: `return make_response(HTTP_STATUS['OK'], HTTP_CODE['OK'], 'Login successful', data)`
- Status & codes: use `utils.http_constants.HTTP_STATUS` and `HTTP_CODE` values rather than hard-coded numbers/strings.
- DB access: dependency injection uses `Database.db_connection.get_mongo_db()` and routers often declare `db=Depends(get_mongo_db)`.
  - Beware: `get_mongo_db()` can be `None` if env vars or connectivity are misconfigured.

Important env vars and startup notes
- Required: `SECRET_KEY` (used by `utils/hashing.create_access_token`). If missing the app will raise on import. Also configure `MONGO_DB_USER`, `MONGO_DB_PASSWORD`, `MONGO_DB_HOST`, `MONGO_DB_NAME` in `.env`.
- Dev run: the project uses `uvicorn` (see `requirements.txt`). Typical dev command:
  - `uvicorn app:app --reload --port 8000`

Authentication and tokens
- Password hashing and verification use Passlib (bcrypt) via `utils/hashing.py`.
- JWT creation: `create_access_token(data: dict)` — tokens expire using `ACCESS_TOKEN_EXPIRE_MINUTES` and are signed with `SECRET_KEY` and `ALGORITHM` from env.

Error handling and patterns to follow
- Validation errors are normalized by `app.exception_handler(RequestValidationError)` in `app.py` — follow its `make_response` structure when returning errors.
- Many routers catch exceptions and return `make_response(HTTP_STATUS['INTERNAL_SERVER_ERROR'], HTTP_CODE['INTERNAL_SERVER_ERROR'], ...)` rather than raising HTTPExceptions in every case.

Code touching points and quick navigation
- Entrypoint: `app.py` — shows mounted routers and global middleware (CORS).
- DB helper: `Database/db_connection.py` — connection string, `get_mongo_db()` and vector DB placeholder.
- Auth: `apis/auth/login.py`, `apis/auth/registration.py` (login shows use of `Depends(get_mongo_db)` and `utils.hashing`).
- Models: `models/*.py` contain Pydantic shapes used across endpoints (`UserRegister`, `UserLogin`, `Token`).
- Utilities: `utils/response_helper.py`, `utils/http_constants.py`, `utils/hashing.py` — reuse these helpers instead of duplicating logic.

Safeguards and edge-cases for code generation
- Do not assume DB is available: add defensive checks after `get_mongo_db()` and return a clear `make_response()` if `None`.
- Preserve the `make_response` shape (http_status, http_code, message, data). Do not change keys or return raw dicts.
- Respect existing HTTP codes from `HTTP_STATUS`/`HTTP_CODE` (use them for consistency).
- Avoid changing global environment handling (loading `.env`) — prefer to read env values via `os.getenv` and fail fast with clear messages.

If you modify or add a router
- Create `apis/<feature>/router.py` with an `APIRouter`, add your endpoints there (tag routes), and ensure it's included in `app.py`.
- Use prefixing inside the router: e.g., `router = APIRouter(prefix="/auth", tags=["Auth"])` and return responses via `make_response`.

When in doubt
- Search for similar patterns in `apis/` and follow the existing small-router + make_response pattern.

Questions / feedback
- If anything here is unclear or you want more examples (tests, CI commands, or environment-template), say which area to expand and I will iterate.
