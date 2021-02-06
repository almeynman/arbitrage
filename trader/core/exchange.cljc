(ns exchange
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [string :as string]
            [percentage :as percentage]
            [money :as money]))

;(defn gen-portfolio [required-asset]
;  (gen/fmap
;    (fn [portfolio] (->> (assoc (first portfolio) :asset required-asset)
;                         (assoc )))
;    (s/gen (s/coll-of ::money/money :min-count 1))))
(s/def ::portfolio (s/coll-of ::money/money :min-count 1))

(s/def ::id ::string/lower-case-alpha)

(s/def ::taker ::percentage/percentage)
(s/def ::maker ::percentage/percentage)
(s/def ::fee (s/keys :req-un [::taker ::maker]))

;(defn gen-exchange [required-asset])
(s/def ::exchange (s/keys :req-un [::id ::portfolio ::fee]))

(comment
  (gen/generate (s/gen ::portfolio))
  (def portfolio (gen/generate (s/gen ::portfolio)))
  (def asset ((gen/generate (s/gen ::money/money)) :asset))
  (def new-portfolio (assoc (first portfolio) :asset asset))
  (assoc [1 2 3] 0 5)
  (gen/sample (s/gen ::maker))
  (gen/sample (s/gen ::exchange)))

