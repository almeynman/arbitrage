(ns timestamp
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]))

(def jan-20-2020 1579538732897)
(def jan-20-2040 2210691279000)
(def gen-timestamp (gen/large-integer* {:min jan-20-2020 :max jan-20-2040}))
(s/def ::timestamp
  (s/with-gen pos-int?
              (fn [] gen-timestamp)))

(defn gen-delta [delta] (gen/large-integer* {:min (- delta) :max delta}))
(def five-seconds 5000)
(s/def ::delta-up-to-five-seconds
  (s/with-gen int?
              (fn [] (gen-delta five-seconds))))

(comment
  (gen/sample (s/gen ::timestamp))
  (gen/sample (s/gen ::delta-up-to-five-seconds)))
