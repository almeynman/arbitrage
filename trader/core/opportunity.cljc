(ns opportunity
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [exchange :as exchange]
            [market :as market]
            [order-book :as order-book]))

(s/def ::buy (s/keys :req-un [::exchange/exchange ::order-book/order-book]))
(s/def ::sell (s/keys :req-un [::exchange/exchange ::order-book/order-book]))

(defn calc-coef [{buy :buy sell :sell}]
  (let [bids (get-in buy [:order-book :bids])
        asks (get-in sell [:order-book :asks])
        highest-bid-price ((first bids) :price)
        lowest-ask-price ((first asks) :price)]
    (/ lowest-ask-price highest-bid-price)))
(defn coef>1? [opportunity] (> (calc-coef opportunity) 1))
(def gen-opportunity
  (gen/let [base-price order-book/gen-realistic-price
            ;TODO mb (order-book/gen-order-book current-price realistic-timestamp)
            buy-order-book (order-book/gen-order-book (int (* base-price 0.99)))
            sell-order-book (order-book/gen-order-book (int (* base-price 1.01)))
            market (s/gen ::market/market)
            ;TODO buy exchange should have portfolio in quote asset
            buy-exchange (s/gen ::exchange/exchange)
            ;TODO sell exchange should have portfolio in base asset
            sell-exchange (s/gen ::exchange/exchange)]
           {:market market
            :buy    {:exchange buy-exchange :order-book buy-order-book}
            :sell    {:exchange sell-exchange :order-book sell-order-book}}))
(s/def ::opportunity
  (s/with-gen
    (s/and coef>1?
           ;TODO timestamp difference should be small
           ;TODO there should be enough balance on both exchanges to take advantage of opportunity
           (s/keys :req-un [::market/market ::buy ::sell]))
    (fn [] gen-opportunity)))

(comment
  (gen/sample (s/gen ::opportunity))
  (def test-opportunity (gen/generate gen-opportunity))
  (calc-coef test-opportunity))
