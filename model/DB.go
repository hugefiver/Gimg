package model

import (
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/sqlite"
)

var DB *gorm.DB

func ConnectDB(url string) (*gorm.DB, error) {
    d, err := gorm.Open("sqlite3", url)
    if err != nil {
        return nil, err
    }
    DB = d
    return d, nil
}
