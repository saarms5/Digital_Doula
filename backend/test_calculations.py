import pytest
from datetime import date, timedelta
from models import calculate_due_date, calculate_current_week

def test_calculate_due_date():
    lmp = date(2023, 1, 1)
    expected_due_date = date(2023, 10, 8) # Jan 1 + 280 days
    assert calculate_due_date(lmp) == expected_due_date

def test_calculate_current_week():
    # If due date is 280 days from today, user is 0 weeks pregnant (conception day/LMP)
    today = date.today()
    due_date = today + timedelta(days=280)
    result = calculate_current_week(due_date)
    assert result["weeks"] == 0
    assert result["days"] == 0
    
    # If due date is 273 days from today, user is 1 week pregnant
    due_date_1w = today + timedelta(days=273)
    result_1w = calculate_current_week(due_date_1w)
    assert result_1w["weeks"] == 1
    assert result_1w["days"] == 0
    
    # If due date is today, user is 40 weeks pregnant
    result_40w = calculate_current_week(today)
    assert result_40w["weeks"] == 40
    assert result_40w["days"] == 0
