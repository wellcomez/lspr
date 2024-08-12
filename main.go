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
	for i := 18080; i < 30000; i++ {
		fmt.Printf("Server listening on http://localhost:%d\n", i)
		if err := http.ListenAndServe(fmt.Sprintf(":%d", i), r); err != nil {
			fmt.Println(i, "Inused")
		} else {
		}

	}
}
