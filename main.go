package main

import (
	"fmt"
	"net/http"
)

func helloWorld(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World!")
}

func main() {
	http.HandleFunc("/", helloWorld) // 注册路由处理函数
	fmt.Println("Server listening on :18080")
	if err := http.ListenAndServe(":18080", nil); err != nil {
		panic(err)
	}
}
