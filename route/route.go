package route

import (
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/hugefiver/Gimg/model"
)

var typeMap = model.TypeMap

var filenameRegex, _ = regexp.Compile(`^(\w+)(\.\w+)?$`)

func GetImage(c *gin.Context) {
	name := c.Param("name")
	if filenameRegex.MatchString(name) {
		id := filenameRegex.FindStringSubmatch(name)[1]

		image := model.Image{
			ImgId: id,
		}
		if !model.DB.First(&image).RecordNotFound() {
			file := model.File{
				Md5: image.FileMd5,
			}
			if !model.DB.First(&file).RecordNotFound() {
				c.Data(200, typeMap[image.Ext], file.Data)
				return
			}
		}
	}
	c.String(404, "Not Found.")
}
