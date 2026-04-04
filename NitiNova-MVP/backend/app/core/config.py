from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "NitiNova MVP"
    api_prefix: str = "/api"
    
    class Config:
        env_file = ".env"

settings = Settings()

