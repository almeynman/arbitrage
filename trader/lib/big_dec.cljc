(ns big-dec
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [big.js :as big]))

;TODO create cljc library to have big-dec in both clojure and clojurescript

(defn big-dec [x] (big/Big. x))
(defn big-dec? [x] (instance? big/Big x))

(defn plus [x y] (.plus x y))
(defn div [x y] (.div x y))
(defn times [x y] (.times x y))
(defn minus [x y] (.minus x y))
(defn pow [x y] (.pow x y))

(comment
  (def one (big/Big. 1))
  (def two (big/Big. 2))
  (def three (big/Big. 3))
  (div two 3)
  (pow three 3)
  (big-dec? one))
