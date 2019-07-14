package model

import "github.com/jinzhu/gorm"

type File struct {
    gorm.Model
    Md5 string `gorm:"size:32;primary_key"`
    Data []byte `gorm:"not null"`
}
