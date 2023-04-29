from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Account(db.Model):
    __tablename__ = 'account'
    
    id = db.Column(db.Integer, primary_key=True)
    account_number = db.Column(db.String, nullable=False)
    total_amount = db.Column(db.Numeric, nullable=False)

    def __init__(self, account_number, total_amount):
        self.account_number = account_number
        self.total_amount = total_amount
