from typing import Any
import json

class Result:
    """
    Result class to store the result of any operation
    """

    status: bool
    detail: Any 

    message: str

    def __init__(self, status: bool, detail: Any = None, message: str = '') -> None:
        self.status = status
        self.detail = detail
        self.message = message
        
    
    @classmethod
    def success(cls, detail: Any, message: str = '') -> 'Result':
        return cls(True, detail = detail, message = message)
    
    @classmethod
    def fail(cls, detail: Any = None, message: str = '') -> 'Result':
        return cls(False, detail = detail, message = message)


def parse_request_body(request) -> Result:
    try:
        data = json.loads(request.body)
    except:
        return Result.fail('Invalid JSON provided.')
    return Result.success(data)

def check_required_keys(data: dict, keys: list) -> Result:
    for key in keys:
        if key not in data:
            return Result.fail(f"Missing required key: {key}")
    return Result.success('All keys are present.')