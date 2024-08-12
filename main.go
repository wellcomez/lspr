package main

import (
	"flag"
	"fmt"
	"net/http"

	httpsrv "zen108.com/lspsrv/pkg"
)

func main() {
	root := flag.String("root", "", "root path")
	flag.Parse()
	r := httpsrv.NewRouter(*root)
	// http.HandleFunc("/path", helloWorld) // 注册路由处理函数
	fmt.Println("Server listening on :18080")
	if err := http.ListenAndServe(":18080", r); err != nil {
		panic(err)
	}
}
