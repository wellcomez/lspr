package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func helloWorld(w http.ResponseWriter, r *http.Request) {
	ss, err := newFunction(r)
	if err != nil {
		println(ss)
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// 其他 CORS 相关头
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	// buf,err=json.Marshal(ss)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ss)

}

type file struct {
	Path      string
	IsDir     bool
	Name      string
	LocalPath string `json:"localpath"`
}

func newFunction(r *http.Request) ([]file, error) {
	ret := []file{}
	path := r.URL.Path
	ss := strings.TrimPrefix(path, "/path/")
	cur, err := os.Getwd()
	if err != nil {
		return ret, err
	}
	dir := filepath.Join(cur, ss)
	dirs, err := os.ReadDir(dir)
	if err != nil {
		return ret, err
	}
	for _, v := range dirs {
		Path := filepath.Join(dir, v.Name())
		ret = append(ret, file{
			LocalPath: filepath.Base(dir),
			Name:      v.Name(),
			IsDir:     v.IsDir(),
			Path:      Path,
		})
	}
	return ret, nil
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/path/{rest:.*}", helloWorld).Methods("GET")
	// http.HandleFunc("/path", helloWorld) // 注册路由处理函数
	fmt.Println("Server listening on :18080")
	if err := http.ListenAndServe(":18080", r); err != nil {
		panic(err)
	}
}
