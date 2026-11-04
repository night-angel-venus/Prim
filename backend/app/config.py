from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY:str = ""
    ALGORITHM:str = "HS256"
    TOKEN_EXPIRATION_MINUTES:int = 600

    RATE_LIMIT:str = "50/minute"

    model_config = SettingsConfigDict(env_file=".env", extra="allow")



settings = Settings()