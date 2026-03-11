import logging

import httpx

logger = logging.getLogger(__name__)


async def check_exercise_status(owner: str, repo_name: str, github_token: str) -> bool:
    """Check if the latest CI workflow run in the repo was successful."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"https://api.github.com/repos/{owner}/{repo_name}/actions/runs",
                headers={"Authorization": f"Bearer {github_token}"},
                params={"per_page": 1, "status": "completed"},
            )
            if response.status_code != 200:
                return False
            runs = response.json().get("workflow_runs", [])
            if not runs:
                return False
            return runs[0]["conclusion"] == "success"
    except httpx.TimeoutException:
        logger.warning(f"GitHub API timeout for {owner}/{repo_name}")
        return False
    except httpx.HTTPError as e:
        logger.error(f"GitHub API error for {owner}/{repo_name}: {e}")
        return False
