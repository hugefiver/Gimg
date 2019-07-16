package model

import (
	"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/mysql"
	//_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var DB *gorm.DB

func ConnectDB(dbType, url string) (*gorm.DB, error) {
	d, err := gorm.Open(dbType, url)
	if err != nil {
		return nil, err
	}
	DB = d
	return d, nil
}
