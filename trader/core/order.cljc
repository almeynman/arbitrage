(ns order
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [asset :as asset]
            [money :as money]))

(s/def ::price ::money/amount)
(s/def ::order (s/keys :req-un [::asset/pair ::money/amount ::price]))

(comment
  (gen/sample (s/gen ::order) 1)
  (def test-order (gen/generate (s/gen ::order)))
  (s/conform ::price "0.0")
  (valid-price? "1.1")
  ())

