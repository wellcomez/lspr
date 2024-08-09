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
	ss, err := newFunction(r, w)
	if err != nil {
		println(ss)
	}
	// buf,err=json.Marshal(ss)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ss)

}

type file struct {
	Path  string
	IsDir bool
	Name  string
}

func newFunction(r *http.Request, w http.ResponseWriter) ([]file, error) {
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
		ret = append(ret, file{
			Name:  v.Name(),
			IsDir: v.IsDir(),
			Path:  filepath.Join(dir, v.Name()),
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
