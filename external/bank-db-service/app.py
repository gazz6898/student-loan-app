import pymongo
from typing import Any, Callable, Dict
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

loan_client = pymongo.MongoClient(
    "mongodb://user:ketteringb@18.191.29.153/")

student_client = pymongo.MongoClient(
    "mongodb://user:ketteringb@18.117.147.179/")


def is_none(x: Any):
    return x is None


def prop_eq(key: str, value: Any) -> (Callable[[Dict[str, Any]], bool]):
    return lambda d: d[key] == value


def insert_loan(bank=None, principal=None, interest=None, subsidized=None):
    if any(is_none, [bank, principal, interest, subsidized]):
        raise Exception("Invalid insert")

    loan_document = {
        "bank": bank,
        "principal": principal,
        "interest": interest,
        "subsidized": subsidized
    }
    print(loan_document)

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

    app.logger.info(filteredLoans)

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


def insert_student(user=None, password=None, firstName=None, lastName=None, email=None, studID=None, credScore=None):
    studentDocument = {
        "Username": user,
        "Password": password,
        "firstName": firstName,
        "lastName": lastName,
        "Email": email,
        "Student ID": studID,
        "Credit Score": credScore
    }

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


def applyLoan(firstName=None, lastName=None, loanID=None):

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
