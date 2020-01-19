(ns order-book
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [money :as money]))

(s/def ::price ::money/amount)
(s/def ::order (s/keys :req-un [::money/amount ::price]))

;TODO make these arguments to generator functions instead of globals
(def min-wall-size 10)
(def max-wall-size 1000)

(def gen-realistic-price
  (money/gen-amount 10000))

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
    (fn [] (gen-bids (gen/generate gen-realistic-price)))))

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
    (fn [] (gen-asks (gen/generate gen-realistic-price)))))

;TODO should probably be more realistic
(s/def ::timestamp pos-int?)

(defn gen-order-book [current-price]
  (gen/let [bids (gen-bids current-price)
            asks (gen-asks current-price)
            timestamp (s/gen ::timestamp)]
           {:bids      bids
            :asks      asks
            :timestamp timestamp}))
(s/def ::order-book
  (s/with-gen
    (s/keys :req-un [::bids ::asks ::timestamp])
    (fn [] (gen-order-book (gen/generate gen-realistic-price)))))

(comment
  (gen/sample (s/gen ::order-book))
  (gen/sample (gen-bids (gen/generate gen-realistic-price)))
  (def test-bids (gen/generate (gen-bids (gen/generate gen-realistic-price))))
  (->> (partition 2 1 [1 2 3 4 5])
       (every? (fn [[fst scd]] (print scd))))
  (s/conform descending-by-price? test-bids)
  (gen/sample (s/gen ::bids))
  (gen/sample (s/gen ::asks)))
