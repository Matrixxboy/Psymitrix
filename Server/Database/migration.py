from models.user_model import User
from Database.db_connection import get_mongo_db

def migrate_users():
    try:
        db = get_mongo_db()
        users = db.users.find()
        user_model_fields = User.model_fields

        for user in users:
            updated = False
            for field_name, field in user_model_fields.items():
                if field_name not in user:
                    user[field_name] = field.default
                    updated = True
            
            if updated:
                db.users.update_one({'_id': user['_id']}, {'$set': user})
        print("Migration completed successfully.")
    except Exception as e:
        print(f"Migration failed: {e}")