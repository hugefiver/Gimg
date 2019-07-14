package model

import "time"

type Image struct {
    ImgId string `gorm:"size:20;primary key" sql:"index"`
    Ext string `gorm:"size:10;not null"`
    UploadTime time.Time `gorm:"size:"`
    Uploader string
    File File
}
