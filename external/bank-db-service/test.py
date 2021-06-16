import unittest
from app import SchemaMismatchException, schemas, insert_loan, insert_student

class TestInserts(unittest.TestCase):
    def test_bad_insert_loan(self):
        print('Testing bad Loan inserts...')
        with self.assertRaises(SchemaMismatchException):
            insert_loan(__dry=True)
        for exclude_field in schemas["Loan"]["min"]:
            print(f'Testing Loan schema mismatch without required field "{exclude_field}"...')
            doc = {
                "bank": "Test Bank",
                "principal": 10000,
                "interest": 0.01,
                "subsidized": False
            }
            doc.pop(exclude_field)
            with self.assertRaises(SchemaMismatchException):
                insert_loan(__dry=True, **doc)

        insert_loan(__dry=True, **{
            "bank": "Test Bank",
            "principal": 10000,
            "interest": 0.01,
            "subsidized": False
        })

    def test_bad_insert_student(self):
        print('Testing bad Student inserts...')

        with self.assertRaises(SchemaMismatchException):
            insert_student(__dry=True)

        for exclude_field in schemas["Student"]["min"]:
            print(f'Testing Student schema mismatch without required field "{exclude_field}"...')
            doc = {
                "Username": "teststudent",
                "Password": "testpassword123",
                "firstName": "Test",
                "lastName": "Student",
                "Email": "test-student@kettering.edu",
                "Student ID": "00000000",
                "Credit Score": "800"
            }
            doc.pop(exclude_field)
            with self.assertRaises(SchemaMismatchException):
                insert_loan(__dry=True, **doc)

        insert_student(__dry=True, **{
            "Username": "teststudent",
            "Password": "testpassword123",
            "firstName": "Test",
            "lastName": "Student",
            "Email": "test-student@kettering.edu",
            "Student ID": "00000000",
            "Credit Score": "800"
        })

