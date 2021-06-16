from typing import Any, Callable, Dict, Type

import pymongo
from flask import Flask, request, jsonify
from flask.wrappers import Response
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

loan_client = pymongo.MongoClient(
    "mongodb://user:ketteringb@18.191.29.153/")

student_client = pymongo.MongoClient(
    "mongodb://user:ketteringb@18.117.147.179/")

schemas = {
    "Loan": {
        "min": {
            "bank": str,
            "principal": int,
            "interest": float,
            "subsidized": bool
        }
    },
    "Student": {
        "min": {
            "Username": str,
            "Password": str,
            "firstName": str,
            "lastName": str,
            "Email": str,
            "Student ID": str,
            "Credit Score": str
        }
    },
    "LoanApplication": {
        "min": {
            "firstName": str,
            "lastName": str,
            "loanID": str
        }
    }
}

class SchemaMismatchException(Exception):
    pass

def verify_schema(typename: str):
    type_schemas: Dict[str, Dict[str, Type]] = schemas.get(typename)

    if type_schemas == None:
        raise SchemaMismatchException(f'No schemas found for type "{typename}"')

    min_schema = type_schemas.get("min")

    if min_schema == None:
        raise SchemaMismatchException(f'No min schema found for type "{typename}"')

    max_schema: Dict[str, Type] = type_schemas.get("max", min_schema)

    def verify(data: Dict[str, Any]) -> Dict[str, Any]:
        for field in min_schema:
            app.logger.debug(
                f'Verifying field "{field}" for type {typename}...')
            if data.get(field) == None:
                raise SchemaMismatchException(
                    f'Missing required field "{field}" on type {typename}.')

        for data_field in data:
            app.logger.debug(
                f'Verifying field "{field}" against {typename} schema...')
            field_type = max_schema.get(data_field)
            data_type = type(data[data_field])
            if field_type == None:
                raise SchemaMismatchException(
                    f'Unknown field "{data_field}" supplied for type {typename}.')
            elif data_type != field_type:
                raise SchemaMismatchException(
                    f'Field "{data_field}" must be of type {str(field_type)}; got {str(data_type)}.')

        return data

    return verify


verify_loan_schema = verify_schema("Loan")


def insert_loan(__dry=False, **doc):
    loan_document = verify_loan_schema(doc)

    if not __dry:
        loanCollection = loan_client["Loans"]["allLoans"]
        loanCollection.insert_one(loan_document)


def find_loan(minPrincipal=None, maxPrincipal=None, minInterest=None, maxInterest=None, sub=None, loanID=None):
    # Getting a list of all of our loan objects
    loanCollection = loan_client["Loans"]["allLoans"]
    allLoans = loanCollection.find()
    filteredLoans = []
    for loan in allLoans:
        loan["_id"] = str(loan["_id"])
        filteredLoans.append(loan)

    # MINIMUM PRINCIPAL FILTER
    if(minPrincipal != None):
        filteredLoans = list(
            filter(lambda loan: loan['principal'] > minPrincipal, filteredLoans))

    # MAXIMIM PRINCIPAL FILTER
    if (maxPrincipal != None):
        filteredLoans = list(
            filter(lambda loan: loan['principal'] < maxPrincipal, filteredLoans))

    # MIN INTEREST FILTER
    if (minInterest != None):
        filteredLoans = list(
            filter(lambda loan: loan['interest'] > minInterest, filteredLoans))

    # MAX INTEREST FILTER
    if (maxInterest != None):
        filteredLoans = list(
            filter(lambda loan: loan['interest'] < maxInterest, filteredLoans))

    # IS SUBSIDIZED FILTER
    if (sub != None):
        filteredLoans = list(
            filter(lambda loan: loan['subsidized'] == sub, filteredLoans))

    # BY LOAN ID FILTER
    if (loanID != None):
        filteredLoans = list(filter(lambda loan: str(
            loan['_id']) == loanID, filteredLoans))

    return filteredLoans


verify_student_schema = verify_schema("Student")


def insert_student(__dry=False, **doc):
    studentDocument = verify_student_schema(doc)

    if not __dry:
        studentCollection = student_client["Students"]["allStudents"]
        studentCollection.insert_one(studentDocument)


def find_student(firstName=None, lastName=None, studID=None, email=None):
    studentCollection = student_client["Students"]["allStudents"]
    allStudents = studentCollection.find()
    filteredStudents = []
    for loan in allStudents:
        loan["_id"] = str(loan["_id"])
        filteredStudents.append(loan)

    if (firstName != None):
        filteredStudents = list(
            filter(lambda student: student['firstName'] == firstName, filteredStudents))

    if (lastName != None):
        filteredStudents = list(
            filter(lambda student: student['lastName'] == lastName, filteredStudents))

    if (studID != None):
        filteredStudents = list(
            filter(lambda student: student['Student ID'] == studID, filteredStudents))

    if (email != None):
        filteredStudents = list(
            filter(lambda student: student['Email'] == email, filteredStudents))

    return filteredStudents


verify_apply_loan = verify_schema("LoanApplication")


def apply_loan(__dry=False, firstName=None, lastName=None, loanID=None):
    verify_apply_loan({
        "firstName": firstName,
        "lastName": lastName,
        "loanID": loanID
    })
    loan = find_loan(loanID=loanID)
    loan = loan[0]
    studentLoanDocument = {
        "bank": loan['bank'],
        "principal": loan['principal'],
        "interest": loan['interest'],
        "subsidized": loan['subsidized'],
        "approved": False,
        "first name": firstName,
        "last name": lastName
    }

    if not __dry:
        studentLoanCollection = student_client["StudentLoans"]['studentLoans']
        studentLoanCollection.insert_one(studentLoanDocument)


def find_student_loan(bank=None):
    studentLoanCollection = student_client["StudentLoans"]['studentLoans']
    yourLoans = studentLoanCollection.find()
    yourCurrLoans = []
    for loan in yourLoans:
        loan["_id"] = str(loan["_id"])
        yourCurrLoans.append(loan)

    filteredLoans = yourCurrLoans
    if (bank != None):
        filteredLoans = list(filter(lambda loan: str(
            loan['bank']) == bank, filteredLoans))

    return filteredLoans


@app.route('/find/loan', methods=["POST"])
def app_find_loan():
    if request.method == "POST":
        result = find_loan(**request.json)
        return jsonify(result)


@app.route('/find/student', methods=["POST"])
def app_find_student():
    if request.method == "POST":
        result = find_student(**request.json)
        return jsonify(result)


@app.route('/find/studentLoan', methods=["POST"])
def app_find_student_loan():
    if request.method == "POST":
        result = find_student_loan(**request.json)
        return jsonify(result)


@app.route('/apply/<loan_id>', methods=["POST"])
def app_apply_student_loan(loan_id):
    if request.method == "POST":
        try:
            student_id = request.json["student_id"]
            students = find_student(studID=student_id)
            if len(students) == 0:
                raise Exception(f'No student found with ID {student_id}')
            student = students[0]
            loan_application = apply_loan(
                firstName=student["firstName"], lastName=student["lastName"], loanID=loan_id)
            return jsonify(loan_application)
        except KeyError:
            return Response(jsonify({"error": 'Request body must contain a "student_id" property.'}).response, 400)
        except Exception as e:
            return Response(jsonify({"error": str(e)}).response, 500)
