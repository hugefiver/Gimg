package model

import "gopkg.in/mgo.v2/bson"

// url `/{tag}/{name}` => Pic
// e.g. `/1551/123.jpg` => `Pic{Tag: "1551",Name: "123.jpg",}`

type Pic struct {
	Id bson.ObjectId `bson:"_id"`
	Tag string `bson:"tag"`
	Name string `bson:"name"`
	File bson.ObjectId `bson:"file"` // Alias to `File.Id`
}
