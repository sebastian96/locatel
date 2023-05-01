from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from cryptography.fernet import Fernet

from models.Account import Account
from models.User import User

import random

app = Flask(__name__)
CORS(app)

with app.app_context():
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/savings_accounts'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["PORT"] = 4000
    app.config["HOST"] = '127.0.0.1'

    db = SQLAlchemy(app)
    ma = Marshmallow(app)
    key = b'sAiAod9XzdX-se2IT4rmegR6RKafwcExuVjEeTf5DGY='
    fernet = Fernet(key)

    @app.route("/api/create_account", methods=["POST"])
    def create_account():
        try:
            data = request.json
            numbers = [str(random.randint(0, 9)) for _ in range(6)]
            account_number = ''.join(numbers)
            encript_account = fernet.encrypt(account_number.encode())

            exist_account = db.session.query(Account).filter(
                Account.account_number == "encript_account").first()

            if exist_account:
                raise Exception("The account number has already exist")

            new_account = Account(
                account_number=encript_account,
                total_amount=data.get("amount")
            )

            db.session.add(new_account)
            db.session.commit()

            new_user = User(
                name=data.get("name"),
                account_id=new_account.id
            )

            db.session.add(new_user)
            db.session.commit()

            return jsonify({
                "status": "created",
                "data": {
                    "id": new_account.id,
                    "user_name": new_user.name,
                    "account_number": account_number,
                    "total_amount": new_account.total_amount
                }
            })

        except Exception as error:
            return f"{error}"

    @app.route("/api/account/consign", methods=["PUT"])
    def consign_account():
        try:
            data = request.json
            account = db.session.query(Account).filter(
                Account.id == data.get("account_id")).first()

            if not account:
                raise Exception("The account_id not found")

            account.total_amount = account.total_amount + data.get("amount")

            db.session.commit()

            return jsonify({
                "status": "success",
                "total_amount": account.total_amount
            })
        except Exception as error:
            return jsonify({
                "status": "error",
                "error":  f"{error}"
            })

    @app.route("/api/account/withdraw", methods=["PUT"])
    def withdraw_account():
        try:
            data = request.json
            account = db.session.query(Account).filter(
                Account.id == data.get("account_id")).first()

            if not account:
                raise Exception("The account_id not found")

            account.total_amount = account.total_amount - data.get("amount")

            if account.total_amount < 0:
                raise Exception("insufficient funds")

            db.session.commit()

            return jsonify({
                "status": "success",
                "total_amount": account.total_amount
            })
        except Exception as error:
            return jsonify({
                "status": "error",
                "error":  f"{error}"
            })

    @app.route("/api/account/balance", methods=["GET"])
    def get_balance():
        try:
            data = request.json
            account = db.session.query(Account).filter(
                Account.id == data.get("account_id")).first()

            if not account:
                raise Exception("The account_id not found")

            return jsonify({
                "status": "success",
                "total_amount": account.total_amount
            })
        except Exception as error:
            return jsonify({
                "status": "error",
                "error":  f"{error}"
            })

    @app.route("/api/accounts", methods=["GET"])
    def accounts():
        try:
            accounts = db.session.query(Account).all()
            format_accounts = []

            for account in accounts:
                user = db.session.query(User).filter(
                    User.account_id == account.id).first()

                format_accounts.append({
                    "id": account.id,
                    "user_name": user.name,
                    "account_number": fernet.decrypt(account.account_number).decode(),
                    "total_amount": account.total_amount
                })

            return jsonify({
                "status": "success",
                "accounts": format_accounts
            })
        except Exception as error:
            return jsonify({
                "status": "error",
                "error":  f"{error}"
            })

    if __name__ == '__main__':
        print(f'Server running on port {app.config["PORT"]}')
        app.run(host=app.config["HOST"], port=app.config["PORT"], debug=True)
