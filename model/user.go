package model

import "gopkg.in/mgo.v2/bson"

type User struct {
	Id bson.ObjectId `bson:"_id"`
	Name string `bson:"name"`
	Password string `bson:"password"`
	Level int `bson:"level"`
	Pics []bson.ObjectId `bson:"pics"` // Alias to `Pic.Id`
}
