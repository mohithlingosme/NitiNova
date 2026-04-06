# Legal document drafting
async def generate_draft(template: str, context: dict) -> str:
    prompt = f"Generate {template} for: {context}"
    from .ai_service import generate_response
    return await generate_response(prompt)

