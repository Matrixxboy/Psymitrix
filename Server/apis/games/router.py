from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from Database.db_connection import get_mongo_db
from models.user_model import User, Games
from apis.auth.authentication import get_current_user
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE

router = APIRouter(prefix="/games", tags=["Games"])

@router.post("/data/save", response_model=Games)
async def create_game(game: Games, current_user: User = Depends(get_current_user), db = Depends(get_mongo_db)):
    try:
        # TODO: Use an Enum for game names for more robust validation
        game_list = ["meditation", "puzzle", "memory", "reaction_time", "breathing"]
        if game.games and all(g.game_name in game_list for g in game.games):
            encoded_game = jsonable_encoder(game)
            db.users.update_one(
                {"email": current_user.email},
                {"$push": {"games": encoded_game}}
            )

            return make_response(
                status_code=HTTP_STATUS["CREATED"],
                code=HTTP_CODE["CREATED"],
                message="Game created successfully",
                data=jsonable_encoder(game)
            )
        else:
            return make_response(
                status_code=HTTP_STATUS["BAD_REQUEST"],
                code=HTTP_CODE["INVALID_INPUT"],
                message="Invalid game name",
                data={}
            )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to create game",
            data={"error": str(e)},
        )
