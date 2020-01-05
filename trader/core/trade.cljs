(ns trade
  (:require [cljs.spec.alpha :as s]
            [clojure.test.check.generators :as gen]
            [asset :as asset]
            [exchange :as exchange]))

(def price-regex #"^\d+\.\d+$")
(defn valid-price? [e]
  (and (re-matches price-regex e)
       (not= "0.0")))
(def gen-price
  (gen/fmap
    (fn [[integer fraction]] (str integer "." fraction))
    (gen/tuple (gen/large-integer* {:min 1}) gen/large-integer)))
(s/def ::price (s/with-gen (s/and string? valid-price?) (fn [] gen-price)))

(s/def ::side #{:buy :sell})
(s/def ::exchange-id ::exchange/id)
(s/def ::amount nat-int?)
(s/def ::trade (s/keys :req-un [::side ::exchange-id ::asset/symbol ::amount ::price]))

(comment
  (gen/sample (s/gen ::trade))
  (s/conform ::price "0.0")
  ())

