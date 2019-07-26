package model

import "time"

var TypeMap = map[string]string{
	"jpg":  "image/jpeg",
	"jpeg": "image/jpeg",
	"png":  "image/png",
	"gif":  "image/gif",
	"bmp":  "image/bmp",
	"webp": "image/webp",
	"ico":  "image/x-icon",
}

type Image struct {
	ImgId      string `gorm:"size:20;primary_key" sql:"index"`
	Ext        string `gorm:"size:10;not null"`
	UploadTime time.Time
	Uploader   string
	FileMd5    string
	File       File `gorm:"foreignkey:FileMd5"`
}
