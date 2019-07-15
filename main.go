package main

import (
    "log"

    "github.com/hugefiver/Gimg/model"
)

func main() {
    db, err := model.ConnectDB("./db.database")
    if err != nil {
        log.Fatal("Connect Database Error. ")
    }
    db.AutoMigrate(&model.Image{})
    db.AutoMigrate(&model.File{})
}
