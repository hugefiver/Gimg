package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/hugefiver/Gimg/model"
	apiRoute "github.com/hugefiver/Gimg/route/api"
)

func main() {
	//gin.SetMode(gin.ReleaseMode)

	db, err := model.ConnectDB("./db.database")
	if err != nil {
		log.Fatal("Connect Database Error:", err)
	}
	defer db.Close()
	db.AutoMigrate(&model.Image{})
	db.AutoMigrate(&model.File{})

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	{
		router.POST("/api/upload", apiRoute.UploadImage)
	}

	router.Run(":8080")
}
