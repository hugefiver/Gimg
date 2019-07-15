package util

import (
    "math/rand"
    "time"
)

const letters = "0123456789abcdef"

func init()  {
    rand.Seed(time.Now().Unix())
}

func GetRandomString(n int) string {
    b := make([]byte, n)
    for i := range b {
        b[i] = getRandomLetter()
    }
    return string(b)
}

func getRandomLetter() byte {
    return letters[rand.Intn(len(letters))]
}