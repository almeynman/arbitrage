(ns index
  ;; (:require [cljs.spec.alpha :as s]
  ;;           [clojure.test.check.generators :as gen])
  )

;; (defn non-blank? [s] (not (clojure.string/blank? s)))
;; (def gen-non-blank (gen/not-empty gen/string-alphanumeric))
;; (s/def ::non-blank
;;   (s/with-gen
;;     (s/and string? non-blank?)
;;     (fn [] gen-non-blank)))

(defn init [] (println "Hello World!"))
(defn add [x y] (+ x y))
