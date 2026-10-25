from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "NimbleDesk"
    DATABASE_URL: str = "postgresql+asyncpg://nimble_user:nimble_pass@localhost:5432/nimble_db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

