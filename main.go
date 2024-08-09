package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gorilla/mux"
)

func get_file_data(r *http.Request) ([]byte, error) {
	path := r.URL.Path
	ss := strings.TrimPrefix(path, "/open")
	cur, err := os.Getwd()
	if err != nil {
		return []byte{}, err
	}
	dir := filepath.Join(cur, ss)
	return os.ReadFile(dir)
}
func openfile(w http.ResponseWriter, r *http.Request) {
	data, _:= get_file_data(r)
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// 其他 CORS 相关头
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.Write(data)

}
func helloWorld(w http.ResponseWriter, r *http.Request) {
	ss, err := newFunction(r)
	if err != nil {
		println(ss.RootName)
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
	Path    string
	IsDir   bool
	Name    string
	DirName string `json:"dirname"`
	Parent  string `json:"parent"`
}
type dir struct {
	Root     string `json:"root"`
	RootName string `json:"rootname"`
	Files    []file `json:"files"`
	Parent   string `json:"parent"`
}

func newFunction(r *http.Request) (dir, error) {
	path := r.URL.Path
	files := []file{}
	ss := strings.TrimPrefix(path, "/path")
	ret := dir{
		Root:     ss,
		RootName: filepath.Base(ss),
		Files:    []file{},
		Parent:   filepath.Dir(filepath.Dir(ss)),
	}
	cur, err := os.Getwd()
	if err != nil {
		return ret, err
	}
	dir := filepath.Join(cur, ss)
	dirs, err := os.ReadDir(dir)
	if err != nil {
		return ret, err
	}
	if ss == "/" {
		ret.RootName = filepath.Base(cur)
	}
	for _, v := range dirs {
		Path := filepath.Join(dir, v.Name())
		Parent := filepath.Base(dir)
		if v.IsDir() {
			Parent = filepath.Join(Parent, v.Name())
		}
		files = append(files, file{
			Parent:  Parent,
			Name:    v.Name(),
			DirName: dir,
			IsDir:   v.IsDir(),
			Path:    Path,
		})
	}
	ret.Files = files
	return ret, nil
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/path/{path:.*}", helloWorld).Methods("GET")
	r.HandleFunc("/open/{path:.*}", openfile).Methods("GET")
	// http.HandleFunc("/path", helloWorld) // 注册路由处理函数
	fmt.Println("Server listening on :18080")
	if err := http.ListenAndServe(":18080", r); err != nil {
		panic(err)
	}
}
