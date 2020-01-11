(ns opportunity
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [exchange :as exchange]
            [order :as order]))


(defn calc-coef [{buy :buy sell :sell}]
  (let [buy-orders (buy :orders)
        sell-orders (sell :orders)
        highest-buy-order (last (sort-by :price buy-orders))
        highest-buy-price (highest-buy-order :price)
        lowest-sell-order (first (sort-by :price sell-orders))
        lowest-sell-price (lowest-sell-order :price)]
    (/ lowest-sell-price highest-buy-price)))


(defn coef>1? [opportunity] (> (calc-coef opportunity) 1))



;(def gen-opportunity
;  (gen/fmap
;    (fn [[order exid amount]]
;      (let [second-order (-> order
;                             (assoc :exchange-id exid)
;                             (assoc :amount amount)
;                             (assoc :price (case (order :side)
;                                             :buy (price/times (order :price) "1.01")
;                                             :sell (price/times (order :price) "0.99")))
;                             (order/flip-side))]
;        [order second-order]))
;    (gen/tuple (s/gen ::order/order) (s/gen ::order/exchange-id) (s/gen ::order/amount))))
;(s/def ::opportunity
;  (s/with-gen
;    (s/and same-symbol?
;           has-buy-order?
;           has-sell-order?
;           coef>1?
;           (s/coll-of ::order/order :count 2 :distinct true :kind vector?))
;    (fn [] gen-opportunity)))

(s/def ::orders
  (s/coll-of ::order/order :min-count 1))

(s/def ::opportunity-item
  (s/keys :req-un [::exchange/exchange ::orders]))

(s/def ::buy ::opportunity-item)
(s/def ::sell ::opportunity-item)
(s/def ::opportunity (s/and coef>1? (s/keys :req-un [::buy ::sell])))

(comment
  (gen/sample (s/gen ::opportunity) 1)
  (def orders (gen/generate (s/gen ::orders)))
  (def opportunity (gen/generate (s/gen ::opportunity)))
  (calc-coef opportunity)
  (sort-by :price orders)
  (gen/generate (gen/large-integer* {:min 1}))

  )
