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

		/*image := model.Image{}
		if !model.DB.Where("img_id = ?", id).First(&image).RecordNotFound() {
			file := model.File{}
			if !model.DB.Where("md5 = ?", image.FileMd5).First(&file).RecordNotFound() {
				c.Data(200, typeMap[image.Ext], file.Data)
				return
			}
		}*/

		image := model.Image{
			ImgId: id,
		}
		if !model.DB.Where(&image).First(&image).RecordNotFound() {
			c.Data(200, typeMap[image.Ext], image.File.Data)
			return
		}
	}
	c.String(404, "Not Found.")
}
