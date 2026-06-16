from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment / .env file."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "sqlite:///./dev.db"

    # Auth
    secret_key: str = "dev-secret-change-me"
    access_token_expire_minutes: int = 720
    algorithm: str = "HS256"

    # First admin (used by seed.py)
    admin_email: str = "admin@example.com"
    admin_password: str = "change-this-password"
    admin_name: str = "Site Owner"

    # Supabase storage
    supabase_url: str = ""
    supabase_service_key: str = ""
    supabase_bucket: str = "portfolio-media"

    # CORS
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
