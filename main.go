package main

import (
	"fmt"
	"net/http"
	httpsrv "zen108.com/lspsrv/pkg"
)


func main() {
	r :=  httpsrv.NewRouter("")
	// http.HandleFunc("/path", helloWorld) // 注册路由处理函数
	fmt.Println("Server listening on :18080")
	if err := http.ListenAndServe(":18080", r); err != nil {
		panic(err)
	}
}

