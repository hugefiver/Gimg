package model

import "gopkg.in/mgo.v2/bson"

type File struct{
	Id bson.ObjectId `bson:"_id"`
	Md5 string `bson:"md5"`
	Size int `bson:"size"`
	File []byte `bson:"file"`
}
