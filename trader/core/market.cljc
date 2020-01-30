(ns market
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [asset :as asset]))

(s/def ::base ::asset/asset)
(s/def ::quote ::asset/asset)
(s/def ::market (s/keys :req-un [::base ::quote]))

(def symbol-regex #"^[A-Z]{3,5}/[A-Z]{3,5}$")
(defn valid-symbol? [s] (re-matches symbol-regex s))
(def gen-symbol
  (gen/fmap
    (fn [[c1 c2]] (str c1 "/" c2))
    (gen/tuple asset/gen-code asset/gen-code)))
(s/def ::symbol (s/with-gen (s/and string? valid-symbol?) (fn [] gen-symbol)))

(defn market->symbol [{base :base quote :quote}]
  (let [{base-code :code} base
        {quote-code :code} quote]
    (->> (str base-code "/" quote-code)
         (clojure.string/upper-case))))
(s/fdef market->symbol
        :args (s/cat :market ::market)
        :ret ::symbol)

(comment
  (gen/sample (s/gen ::market))
  (def test-market (gen/generate (s/gen ::market)))
  (s/exercise-fn market->symbol))
