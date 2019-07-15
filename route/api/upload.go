package api

import (
	"crypto/md5"
	"fmt"
	"io/ioutil"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hugefiver/Gimg/model"
	"github.com/hugefiver/Gimg/util"
)

const (
	_ = 1 << (10 * iota)
	KB
	MB
	GB
	TB
)

var typeMap = model.TypeMap

func UploadImage(c *gin.Context) {
	if file, err := c.FormFile("file"); err != nil {
		c.JSON(400, gin.H{
			"status": -1,
			"msg":    "Upload Error.",
		})
	} else if file.Size > 8*MB {
		c.JSON(400, gin.H{
			"status": -2,
			"msg":    "File Too Large.",
		})
	} else {
		names := strings.Split(file.Filename, ".")
		ext := names[len(names)-1]
		if _, ok := typeMap[ext]; len(names) >= 2 && ok {
			f, err := file.Open()
			if err != nil {
				c.JSON(400, gin.H{
					"status": -4,
					"msg":    "File Uploaded Failed.",
				})
				return
			}

			bs, _ := ioutil.ReadAll(f)
			hs := fmt.Sprintf("%x", md5.Sum(bs))
			fileModel := model.File{
				Md5: hs,
			}
			if model.DB.Find(&fileModel).RecordNotFound() {
				fileModel.Data = bs
				model.DB.Create(&fileModel)
			}

			imageId := fmt.Sprintf("%x", time.Now().Unix()) + util.GetRandomString(12)
			model.DB.Create(&model.Image{
				ImgId:      imageId,
				Ext:        ext,
				UploadTime: time.Now(),
				Uploader:   "guest",
				FileMd5:    hs,
			})
			c.JSON(200, gin.H{
				"status": 0,
				"id":     imageId,
				"ext":    ext,
			})
		} else {
			c.JSON(400, gin.H{
				"status": -3,
				"msg":    "Not Supported File Type.",
			})
		}
	}
}
