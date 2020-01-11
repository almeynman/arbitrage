(ns opportunity
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [price :as price]
            [order :as order]))

(defn same-symbol? [[o1 o2]] (= (o1 :symbol) (o2 :symbol)))
(defn different-exchanges? [[o1 o2]] (not= (o1 :exchange-id) (o2 :exchange-id)))
(defn has-buy-order? [orders]
  (some order/is-buy-order? orders))
(defn has-sell-order? [orders]
  (some order/is-sell-order? orders))
(defn calc-coef [orders]
  (let [buy-order (first (filter order/is-buy-order? orders))
        sell-order (first (filter order/is-sell-order? orders))
        buy-price (buy-order :price)
        sell-price (sell-order :price)]
    (price/div sell-price buy-price)))
(defn coef>1? [orders] (price/gt (calc-coef orders) "1"))

(def gen-opportunity
  (gen/fmap
    (fn [[order exid amount]]
      (let [second-order (-> order
                             (assoc :exchange-id exid)
                             (assoc :amount amount)
                             (assoc :price (case (order :side)
                                             :buy (price/times (order :price) "1.01")
                                             :sell (price/times (order :price) "0.99")))
                             (order/flip-side))]
        [order second-order]))
    (gen/tuple (s/gen ::order/order) (s/gen ::order/exchange-id) (s/gen ::order/amount))))
(s/def ::opportunity
  (s/with-gen
    (s/and same-symbol?
           different-exchanges?
           has-buy-order?
           has-sell-order?
           coef>1?
           (s/coll-of ::order/order :count 2 :distinct true :kind vector?))
    (fn [] gen-opportunity)))

(comment
  (gen/sample (s/gen ::opportunity))
  (gen/generate (gen/large-integer* {:min 1}))
  (def opportunity (gen/generate (s/gen ::opportunity)))
  (def opportunity [{:side :buy, :exchange-id "cfu", :symbol "GXJO/NEZC", :amount 1, :price "8.10"}
                    {:side :sell, :exchange-id "mftojmwak", :symbol "GXJO/NEZC", :amount 18, :price "8.181"}])
  (coef>1? opportunity)
  (first (filter order/is-buy-order? opportunity))
  (calc-coef opportunity)
  (def order (gen/generate (s/gen ::order/order)))
  (def exid (gen/generate (s/gen ::order/exchange-id)))
  (def amount (gen/generate (s/gen ::order/amount)))
  (let [second-order (-> order
                         (assoc :exchange-id exid)
                         (assoc :amount amount)
                         (assoc :price (case (order :side)
                                         :buy (price/times (order :price) "1.01")
                                         :sell (price/times (order :price) "0.99")))
                         (order/flip-side))]
    [order second-order])
  ())

