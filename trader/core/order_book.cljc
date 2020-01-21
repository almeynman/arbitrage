(ns order-book
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [timestamp :as timestamp]
            [money :as money]))

(def min-price 10000)
(def gen-price
  (money/gen-amount min-price))
(s/def ::price
  (s/with-gen
    ::money/amount
    (fn [] gen-price)))
(s/def ::order (s/keys :req-un [::money/amount ::price]))

;TODO make these arguments to generator functions instead of globals
(def min-wall-size 10)
(def max-wall-size 100)

(defn descending-by-price? [orders]
  (->> orders
       (partition 2 1)
       (every? (fn [[fst scd]] (>= (fst :price) (scd :price))))))
(defn gen-bids [current-price]
  (gen/fmap
    (fn [percentage-deltas]
      (->> (sort percentage-deltas)
           (map (fn [p] (->> (/ p 10000)
                             (- 1)
                             (* current-price)
                             (int)
                             (assoc (gen/generate (s/gen ::order)) :price))))))
    (gen/vector (gen/choose 1 9999) min-wall-size max-wall-size)))
(s/def ::bids
  (s/with-gen
    (s/and descending-by-price?
           ;TODO should probably be a list, as only accessing items from the beginning
           (s/coll-of ::order :min-count min-wall-size))
    (fn [] (gen-bids (gen/generate (s/gen ::price))))))

(defn ascending-by-price? [orders]
  (->> orders
       (partition 2 1)
       (every? (fn [[fst scd]] (<= (fst :price) (scd :price))))))
(defn gen-asks [current-price]
  (gen/fmap
    (fn [percentage-deltas]
      (->> (sort percentage-deltas)
           (map (fn [p] (->> (/ p 10000)
                             (+ 1)
                             (* current-price)
                             (int)
                             (assoc (gen/generate (s/gen ::order)) :price))))))
    (gen/vector (gen/choose 1 9999) min-wall-size max-wall-size)))
(s/def ::asks
  (s/with-gen
    (s/and ascending-by-price?
           ;TODO should probably be a list, as only accessing items from the beginning
           (s/coll-of ::order :min-count min-wall-size))
    (fn [] (gen-asks (gen/generate (s/gen ::price))))))

(defn gen-order-book [current-price timestamp]
  (gen/let [bids (gen-bids current-price)
            asks (gen-asks current-price)]
           {:bids      bids
            :asks      asks
            :timestamp timestamp}))
(s/def ::order-book
  (s/with-gen
    (s/keys :req-un [::bids ::asks ::timestamp/timestamp])
    (fn [] (gen-order-book (gen/generate (s/gen ::price))
                           (gen/generate (s/gen ::timestamp/timestamp))))))

(comment
  (gen/sample (s/gen ::order-book))
  (gen/sample (gen-bids (gen/generate (s/gen ::price))))
  (def test-bids (gen/generate (gen-bids (gen/generate (s/gen ::price)))))
  (->> (partition 2 1 [1 2 3 4 5])
       (every? (fn [[fst scd]] (print scd))))
  (s/conform descending-by-price? test-bids)
  (gen/sample (s/gen ::bids))
  (gen/sample (s/gen ::asks)))
