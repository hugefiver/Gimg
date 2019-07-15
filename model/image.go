package model

import "time"

type Image struct {
    ImgId string `gorm:"size:20;primary_key" sql:"index"`
    Ext string `gorm:"size:10;not null"`
    UploadTime time.Time
    Uploader string
    File File  `gorm:"ForeignKey:FileMd5;Association_ForeignKey:Md5"`
    FileMd5 string
}
