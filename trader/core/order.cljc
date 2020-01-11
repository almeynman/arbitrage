(ns order
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [asset :as asset]
            [money :as money]
            [exchange :as exchange]))

; TODO bid and ask instead of buy and sell
(s/def ::side #{:buy :sell})
(s/def ::price ::money/amount)
(s/def ::order (s/keys :req-un [::side ::exchange ::asset/pair ::money/amount ::price]))

(defn is-buy-order? [{side :side}] (= :buy side))
(defn is-sell-order? [{side :side}] (= :sell side))
(defn flip-side [o]
  (case (o :side)
    :buy (assoc o :side :sell)
    :sell (assoc o :side :buy)))

(comment
  (gen/sample (s/gen ::side))
  (gen/sample (s/gen ::order) 2)
  (def test-order (gen/generate (s/gen ::order)))
  (flip-side test-order)
  (s/conform ::price "0.0")
  (valid-price? "1.1")
  ())

