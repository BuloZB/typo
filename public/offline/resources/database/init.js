//create database object
var database = DatabaseCreator.create("sqlite")

//init db tables
database.create_tables()

//create global db connection object
var db = database.get_connection()