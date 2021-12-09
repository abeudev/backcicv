const merge = require('lodash.merge');

/**
 * 
 * 
 * This helper will turn datatble request into basic pipeline that will reduce the work for querying to retrieve 
 * datatable data. 
 * 
 * This helper is also able to take custom query which aren't provided in the basic datatable pipeline. 
 * 
 *   const table = new Datatable(req.body.datatable);
 *   table.set_custom_query([
 *       {
 *           $match: {isActive:}
 *       }
 *   ]);
 *   const pipeline = table.generate_pipeline();
 *   
 *   Collection.aggregate(pipeline)
 *     .then(data => {
 *       console.log(table.result(data))
 *     })
 *     .catch(err => {
 *       console.log(err)
 *     });
 * 
 */
class Datatable {
    constructor(request) {
        this.pipeline = [];
        this.request = request;
        this.is_limited = (this.request.length >= 0);
        this.search_something = (this.request.search.value !== '');
    }

    /**
     * 
     * This method will push custom query which is not essential for datatable query,
     * e.g lookup, group, etc.
     * 
     * @param array custom_query 
     * 
     */
    set_custom_query(custom_query) {
        this.custom_query = custom_query;
    }
    set_custom_query1(custom_query1) {
        this.custom_query1 = custom_query1;
    }


    /**
     * 
     * This method will format aggregate result as per what datatable response needed
     * 
     * @param array data 
     */
    result(data) {
        let recordsTotal = 0;
        let tableData = [];

        if (data.length > 0 ) {
            recordsTotal = data[0].count;
            tableData  = data[0].data;
        }
        let result = {
            draw: this.request.draw,
            recordsTotal: recordsTotal,
            recordsFiltered: recordsTotal,
            data: tableData
        };
        return result;
    }

    /**
     * 
     * This method will generate basic query for datatable pipeline 
     * 
     */
    generate_pipeline() {
        this.pipeline = [
            this.set_projection(),
        ];

        if (this.search_something) {
            this.pipeline = this.pipeline.concat(this.set_search());
        }

        this.pipeline = this.pipeline.concat(this.set_group());

        this.pipeline.push(this.set_sort(),this.set_skip());

        if (this.is_limited) {
            this.pipeline.push(this.set_limit());
        }

        this.pipeline.push(this.final_grouping());

        if (this.custom_query) {
            this.pipeline = this.custom_query.concat(this.pipeline);
        }
        
        if (this.custom_query1) {
            this.pipeline = this.custom_query1.concat(this.pipeline);
        }
        return this.pipeline ;

    }

    final_grouping() {
        return {
            $group: {
                _id: null,
                data: {$push: '$data'},
                count: {$first: '$count'}
            }
        }
    }

    set_group() {
        return [
            {
                $group: {
                    _id: null,
                    data: {$push: this.set_group_data()},
                    count: {$sum: 1}
                }
            },
            {$unwind: '$data'}
        ];
    }

    set_group_data() {
        let mergedObject = {};

        const objectFromString = this.request.columns.map(column => {
            return this.dotted_string_to_object(column.data, '$'+column.data)
        });
        objectFromString.forEach(object => {
            mergedObject = merge(mergedObject, object);
        });
        return mergedObject;
    }

    set_projection() {
        const temp = {};
        this.request.columns.forEach(column => {
            let field = column.data;
            temp[field] = {
                $cond: {
                    if: {$eq: [{$type: '$'+field}, 'date']},
                    then: {$subtract: ['$'+field, new Date("1970-01-01T00:00:00Z")]},
                    else: '$'+field
                }
            }
        });

        return {'$project': temp};
    }

    set_sort(){
        const query = {};
        this.request.order.forEach(order => {
            let column_index = order.column;
            let column = 'data.'+this.request.columns[column_index].data;
            query[column] = (order.dir === 'asc') ? 1: -1;
        });
        return {'$sort': query};
    }

    set_skip() {
        return {'$skip': this.request.start};
    }

    dotted_string_to_object(str, val) {
        let i, obj = {}, strarr = str.split(".");
        let x = obj;
        for(i=0;i<strarr.length-1;i++) {
            x = x[strarr[i]] = {};
        }
        x[strarr[i]] = val;
        return obj;
    }

    set_limit() {
        return {'$limit': this.request.length};
    }

    set_search() {
        let search_query = [];
        let searchable_columns = this.request.columns.filter(column => {
            return column.searchable;
        });

        if (searchable_columns.length <= 0) {
            return [];
        }

        searchable_columns.forEach(column => {
            let query = {};
            query[column.data] = {
                $regex: this.request.search.value,
                $options: 'im'
            };
            search_query.push(query);
        });

        return [
            {$match: {$or: search_query}}
        ];
    }
}

module.exports = Datatable;