package main

import (
	"flag"
	httpsrv "zen108.com/lspsrv/pkg"
)

func main() {
	root := flag.String("root", "", "root path")
	flag.Parse()
	// http.HandleFunc("/path", helloWorld) // 注册路由处理函数
	httpsrv.StartServer(*root,18080)
}

